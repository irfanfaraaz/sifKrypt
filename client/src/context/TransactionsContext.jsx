import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { contractAddress, contractABI } from '../utils/constants';

export const TransactionsContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log(provider, signer, transactionsContract);
    return transactionsContract;   

};

export const TransactionsProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }
    
    const getAllTransactions = async () => {
        try {
            if(!ethereum) {
                alert('Make sure you have metamask installed!');
            } 
            const transactionsContract = getEthereumContract();

            const availableTransactions = await transactionsContract.getAllTransactions();
            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber()*1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10**18)
            }));
            setTransactions(structuredTransactions);
            console.log("availableTransactions");
            console.log(structuredTransactions);
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) {
                alert('Make sure you have metamask installed!');
            }    
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if(accounts.length !== 0) {
                setCurrentAccount(accounts[0]);
                getAllTransactions();
            }else{
                console.log('No account found');
            }
            
        } catch (error) {
            console.log({ error });

            throw new Error('No ethereum object found!');
            }
        
    }

    const checkIfTransactionsExist = async () => {
    try {
        const transactionsContract = getEthereumContract();
        const transactionCount = await transactionsContract.getTransactionCount();
        window.localStorage.setItem("transactionCount", transactionCount);

        console.log("transactionCount");
        console.log(transactionCount.toNumber());
      
    } catch (error) {
      console.log(error);
    }
  };

    const connectWallet = async () => {
        try {
            if(!ethereum) {
                alert('Make sure you have metamask installed!');
            } 
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
            
        } catch (error) {
            console.log({ error });
            throw new Error('No ethereum object found!');
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) {
                alert('Make sure you have metamask installed!');
            } 

            const { addressTo, amount, keyword, message } = formData;

            const transactionsContract = getEthereumContract();

            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex,
                }],
            });

            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading-${ transactionHash.hash }`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success-${ transactionHash.hash }`);

            const transactionsCount = await transactionsContract.getTransactionCount();

            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();
            
        } catch (error) {
            console.log({ error });
            throw new Error('No ethereum object found!');
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return(
        <TransactionsContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading }}>
            {children}
        </TransactionsContext.Provider>
    )
};