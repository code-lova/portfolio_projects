import React from "react";
import * as FaIcons from "react-icons/fa6";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";



export const AdminSidebarData = [
    {
        title: 'Home',
        path: '/admin/dashboard',
        icon: <AiIcons.AiFillHome />,
        cName: 'sidebar-text'
    },

    {
        title: 'Chefs',
        path: '/admin/chefs',
        icon: <FaIcons.FaFireBurner />,
        cName: 'sidebar-text'
    },

    {
        title: 'Categories',
        path: '/admin/categories',
        icon: <FaIcons.FaQrcode />,
        cName: 'sidebar-text'
    },


    {
        title: 'Recipies',
        path: '/admin/recipies',
        icon: <FaIcons.FaBowlFood />,
        cName: 'sidebar-text'
    },

    {
        title: 'Ratings',
        path: '/admin/ratings',
        icon: <IoIcons.IoIosStar />,
        cName: 'sidebar-text'
    },

    {
        title: 'Comments',
        path: '/admin/comments',
        icon: <FaIcons.FaComments />,
        cName: 'sidebar-text'
    },

    {
        title: 'Messages',
        path: '/admin/contact-messages',
        icon: <FaIcons.FaMessage />,
        cName: 'sidebar-text'
    },

]
