import HeaderOnly from '../layouts/HeaderOnly';
import MainDivider from '../components/home/MainDivider';
import Login from '../components/login/Login';
import Signup from '../components/signup/SignUp';
import ResetPassword from '../components/reset-password/ResetPassword';
import PostStory from '../components/story/PostStory';
import UpdateStory from '../components/story/UpdateStory';
import React from 'react';
import ManagedStories from '../components/story/ManagedStories';
import StoryInfo from '../components/story/StoryInfo';
import Categories from '../components/features/Categories';
import Followed from '../components/features/Followed';
import Books from '../components/features/Books';
import AuthorBooks from '../components/features/AuthorBooks';
import Profile from '../components/auth/Profile';  
import PostChapter from '../components/chapter/PostChapter';   
import ChapterInfo from '../components/chapter/ChapterInfo';
import AdminLayout from '../components/admin/AdminLayout';
import UserList from '../components/admin/users/UserList';
import StoryList from '../components/admin/stories/StoryList';
import ChapterList from '../components/admin/chapters/ChapterList';
import CommentList from '../components/admin/comments/CommentList';
import UpdateChapter from '../components/chapter/UpdateChapter';
import InsertChapter from '../components/chapter/InsertChapter';
import Profile2 from '../components/auth/Profile';  

const publicRoutes = [
    {
        path: '/',
        component: MainDivider,
        layout: HeaderOnly,
    },
    {
        path: '/categories',
        component: Categories,
        layout: HeaderOnly,
    },
    {
        path: '/genre/:genreId',
        component: Categories,
        layout: HeaderOnly,
    },
    {
        path: '/signup',
        component: Signup,
        layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    {
        path: '/login',
        component: Login,
        layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    {
        path: '/reset-password',
        component: ResetPassword,
        layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    {
        path: '/story/:storyId',
        component: StoryInfo,
        layout: ({ children }) => <>{children}</>,
    },
    {
        path: '/:storyId/:chapterNumber',
        component: ChapterInfo,
        layout: ({ children }) => <>{children}</>,
    },
    {
        path: '/books',
        component: Books,
        layout: HeaderOnly,
    },
    {
        path: '/author/:authorName',
        component: AuthorBooks,
        layout: HeaderOnly,
    },
];

const protectedRoutes = [
    {
        path: '/add-story',
        component: PostStory,
        layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    {
        path: '/followed',
        component: Followed,
        layout: HeaderOnly,
    },
    {
        path: `/update-story/:storyId`,
        component: UpdateStory,
        layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    {
        path: '/managed-story',
        component: ManagedStories,
        layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    {
        path: '/add-chapter/:storyId',
        component: PostChapter,
        layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    {
        path: `/update-chapter/:storyId/:chapterNumber`,
        component: UpdateChapter,
        layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    {
        path: `/insert-chapter/:storyId`,
        component: InsertChapter,
        layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    {
        path: '/followed',
        component: Followed,
        layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    {
        path: '/admin',
        component: UserList,
        layout: AdminLayout,
    },
    {
        path: '/admin/users',
        component: UserList,
        layout: AdminLayout,
    },
    {
        path: '/admin/stories',
        component: StoryList,
        layout: AdminLayout,
    },
    {
        path: '/admin/chapters',
        component: ChapterList,
        layout: AdminLayout,
    },
    {
        path: '/admin/comments',
        component: CommentList,
        layout: AdminLayout,
    },
    {
        path: '/profile',
        component: Profile,
        layout: HeaderOnly,
    }
];

export { publicRoutes, protectedRoutes };
