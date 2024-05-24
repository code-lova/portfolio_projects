import React from "react";
import * as FaIcons from "react-icons/fa6";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";


export const SidebarData = [
    {
        title: 'Home',
        path: '/user/dashboard',
        icon: <AiIcons.AiFillHome />,
        cName: 'sidebar-text'
    },

    // {
    //     title: 'Categories',
    //     path: '/user/category',
    //     icon: <FaIcons.FaQrcode />,
    //     cName: 'sidebar-text'
    // },

    {
        title: 'Recipies',
        path: '/user/recipies',
        icon: <FaIcons.FaBowlFood />,
        cName: 'sidebar-text'
    },

    {
        title: 'Ratings',
        path: '/user/ratings',
        icon: <IoIcons.IoIosStar />,
        cName: 'sidebar-text'
    },

    {
        title: 'Comments',
        path: '/user/comments',
        icon: <FaIcons.FaComments />,
        cName: 'sidebar-text'
    },

    {
        title: 'Contact Admin',
        path: '/user/contact',
        icon: <IoIcons.IoIosContacts />,
        cName: 'sidebar-text'
    }

    // {
    //     title: 'Messages',
    //     path: '/user/message',
    //     icon: <FaIcons.FaMessage />,
    //     cName: 'sidebar-text'
    // },

]
