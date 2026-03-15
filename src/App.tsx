import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { publicRoutes, protectedRoutes } from './routes';
import React from 'react';
import RequireAuth from './components/RequireAuth';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

interface RouteConfig {
    path: string;
    component: React.ComponentType;
    layout?: React.ComponentType<{ children: React.ReactNode }>;
}

function App() {
    return (
        <BrowserRouter>
                <div className="App">
                    <Routes>
                        {/* Public Routes (No Authentication Required) */}
                        {publicRoutes.map((route: RouteConfig, index) => {
                            const Layout =
                                route.layout || (({ children }: { children: React.ReactNode }) => <>{children}</>);
                            const Component = route.component;

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Component />
                                        </Layout>
                                    }
                                />
                            );
                        })}

                        {/* Protected Routes (Require Authentication) */}
                        <Route element={<RequireAuth />}>
                            {protectedRoutes.map((route: RouteConfig, index) => {
                                const Layout =
                                    route.layout || (({ children }: { children: React.ReactNode }) => <>{children}</>);
                                const Component = route.component;

                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <Layout>
                                                <Component />
                                            </Layout>
                                        }
                                    />
                                );
                            })}
                        </Route>
                    </Routes>
                    <ToastContainer />
                </div>
        </BrowserRouter>
    );
}

export default App;
