
import NavItem from '@/Components/shared/AdminSidebar/partials/NavItem';
import { usePage } from '@inertiajs/react';
import React from 'react';  // Import React

const SideNavLinks: React.FC = () => {
    const { openTicketCount }: any = usePage().props;

const navigationLinks = [
    { name: "Dashboard", link: false, border: false },
    {
        name: "Dashboard",
        link: true,
        border: false,
        startWith: "/",
        route: "admin.dashboard",
        icon: "ChartPieIcon",
        count: 0,
    },
    { name: "Users ", link: false, border: false },
    {
        name: "Users",
        link: true,
        border: false,
        startWith: "/admin/clients",
        route: "admin.clients.index",
        icon: "UserIcon",
        children: [
            {
                name: "Clients",
                startWith: "/admin/clients",
                route: "admin.clients.index",
                icon: "ArrowLongRightIcon",

            },
            {
                name: "Freelancers",
                startWith: "/admin/clients",
                route: "admin.freelancers.index",
                icon: "ArrowLongRightIcon",

            },
            {
                name: "Identity Verifications",
                startWith: "/admin/identity-verifications",
                route: "admin.identity-verifications.index",
                icon: "ArrowLongRightIcon",
            },

        ],
    },
    { name: "Payments", link: false, border: false },
    {
        name: "Payments",
        link: true,
        border: false,
        startWith:  "/admin/balance-requests",
        route: "admin.connect-packages.index",
        icon: "BanknotesIcon",
        children: [
            {
                name: "Connect Packages",
                startWith: "/admin/connect-packages",
                route: "admin.connect-packages.index",
                icon: "ArrowLongRightIcon",

            },
            {
                name: "Payments",
                startWith: "/admin/payments",
                route: "admin.payments.index",
                icon: "ArrowLongRightIcon",

            },
            {
                name: "Payouts",
                startWith: "/admin/balance-requests",
                route: "admin.balance-requests.index",
                icon: "ArrowLongRightIcon",
            },

        ],
    },
    { name: "Help & Support", link: false, border: false },
    {
        name: "Threads",
        link: true,
        border: false,
        startWith: "/admin/tickets",
        route: "admin.tickets.index",
        icon: "TicketIcon",
        count: openTicketCount,
    },
    { name: "Settings", link: false, border: false },
    {
        name: "Settings",
        link: true,
        border: false,
        startWith: "/admin/settings",
        route: "admin.connect-packages.index",
        icon: "Cog6ToothIcon",
        children: [
            {
                name: "Pages",
                startWith: "/admin/pages/edit",
                route: "admin.pages.edit",
                icon: "ArrowLongRightIcon",

            },
            // {
            //     name: "Job Categories",
            //     startWith: "/admin/categories",
            //     route: "admin.categories.index",
            //     icon: "ArrowLongRightIcon",

            // },
            // {
            //     name: "Skill Categories",
            //     startWith: "/admin/skills",
            //     route: "admin.skills.index",
            //     icon: "ArrowLongRightIcon",
            // },
            {
                name: "Sports Categories",
                startWith: "/admin/sports",
                route: "admin.skills.index",
                icon: "ArrowLongRightIcon",
            },
            // {
            //     name: "Banks",
            //     startWith: "/admin/bank-details",
            //     route: "admin.bank-details.index",
            //     icon: "ArrowLongRightIcon",
            // },


        ],
    },

];
return (
    <div>
    {navigationLinks.map((item: any, index: number) => (
        <NavItem
        key={item.name + index}
        name={item.name}
        routeName={route(item.route)}
        startWith={item.startWith}
        icon={item.icon}
        link={item.link}
        count={item.count}
        border={item.border}
        children={item.children}
        />
    ))}
    </div>
);
};

export default SideNavLinks;
