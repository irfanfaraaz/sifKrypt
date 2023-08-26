import React, { useContext } from 'react';
import { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { TransactionsContext } from '../context/TransactionsContext';
import logo from "../../images/logo.png";
 
const NavbarItems = ({ title, classProps }) => {
    return(
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            {title}
        </li>
    )
}

const Navbar = () => {

    const {connectWallet, currentAccount } = useContext(TransactionsContext);

    const [toogleMenu, setToogleMenu] = useState(false);

    return(
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <img src={logo} alt="logo" className="w-32 cursor-pointer" />
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
                    <NavbarItems key={item+index} title={item} />
                ))}
                {!currentAccount &&(
                        <button type='button' onClick={connectWallet} className='flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]'>
                            <p className='text-white text-base font-semibold'>
                                Connect Wallet
                            </p>
                        </button>
                    )}
            </ul>
            <div className="flex relative">
                {toogleMenu
                    ? <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToogleMenu(false)} />
                    : <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToogleMenu(true)} />
                }
                {toogleMenu &&(
                    <ul className="z-10  fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
                        flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white  animate-slide-in"
                    >
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose onClick={()=> setToogleMenu(false)} />
                        </li>
                        {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
                        <NavbarItems key={item+index} title={item} classProps="my-2 text-lg"/>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default Navbar;