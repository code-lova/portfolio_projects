import React from "react";
import {Routes, Route} from "react-router-dom"
import FrontendLayout from "../layouts/frontend/FrontendLayout";
import Home from "../components/frontend/Home";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import PublicRoutes from "./PublicRoutes";
import Recipe from "../components/frontend/Recipe";
import Search from "../components/frontend/Search";
import Contact from "../components/frontend/Contact";
import SavedRecipe from "../components/frontend/SavedRecipe";
import UserLayout from "../layouts/user/UserLayout";
import Dashboard from "../components/users/Dashboard";
import Recipes from "../components/users/recipe/Recipes";
import AddRecipe from "../components/users/recipe/AddRecipe";
import Ratings from "../components/users/Ratings";
import Comments from "../components/users/Comments";
import ContactAdmin from "../components/users/ContactAdmin";
import AdminLayout from "../layouts/admin/AminLayout";
import AdminDashboard from "../components/admin/AdminDashboard";
import Chefs from "../components/admin/chefs/Chefs";
import ViewChef from "../components/admin/chefs/ViewChef";
import Category from "../components/admin/category/Category";
import AddCategory from "../components/admin/category/AddCategory";
import AdminRecipe from "../components/admin/recipe/AdminRecipe";
import AdminViewrecipe from "../components/admin/recipe/AdminViewrecipe";
import AdminRatings from "../components/admin/AdminRatings";
import AdminComments from "../components/admin/AdminComments";
import ContactMessages from "../components/admin/ContactMessages";
import UserCategory from "../components/users/category/UserCategory";
import Verify from "../components/auth/Verify";
import UserProtectedRoutes from "./UserProtectedRoutes";
import AdminProtectedRoutes from "./AdminProtectedRoutes";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import ViewCategory from "../components/admin/category/ViewCategory";
import EditRecipe from "../components/users/recipe/EditRecipe";
import RecipeCategory from "../components/frontend/RecipeCategory";

const Routers = () => {

    return(
        <Routes>
            <Route path="/" element={<FrontendLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="recipe/:slug" element={<Recipe />}/>
                <Route path="recipe-categories/:slug" element={<RecipeCategory />}/>
                <Route path="saved-recipe" element={<SavedRecipe />}/>
                <Route path="search" element={<Search />}/>
                <Route path="/contact" element={<Contact />}/>
            </Route>

            <Route path="/user" element={<UserProtectedRoutes />}>
                <Route path="dashboard" element={<Dashboard />}/>
                <Route path="category" element={<UserCategory />}/>
                <Route path="recipies" element={<Recipes />} />
                <Route path="add-recipes" element={<AddRecipe />} />
                <Route path="edit-recipe/:slugs" element={<EditRecipe />} />
                <Route path="ratings" element={<Ratings />} />
                <Route path="comments" element={<Comments />} />
                <Route path="contact" element={<ContactAdmin />} />
            </Route>

            <Route path="/admin" element={<AdminProtectedRoutes />}>
                <Route path="dashboard" element={<AdminDashboard />}/>
                <Route path="chefs" element={<Chefs />}/>
                <Route path="view-chef/:id" element={<ViewChef />}/>
                <Route path="categories" element={<Category />}/>
                <Route path="add-category" element={<AddCategory />}/>
                <Route path="edit-category/:id" element={<ViewCategory />}/>
                <Route path="recipies" element={<AdminRecipe />} />
                <Route path="view-recipe/:slugs" element={<AdminViewrecipe />} />
                <Route path="ratings" element={<AdminRatings />} />
                <Route path="comments" element={<AdminComments />} />
                <Route path="contact-messages" element={<ContactMessages />} />

            </Route>

            
            <Route path="/login" element={<PublicRoutes component={Login} />} />
            <Route path="/register" element={<PublicRoutes component={Register} />} />
            <Route path="/verify" element={<PublicRoutes component={Verify} />} />
            <Route path="/forgot-password" element={<PublicRoutes component={ForgotPassword} />} />
            <Route path="/reset-password/:token" element={<PublicRoutes component={ResetPassword} />} />


        </Routes>


    );

}

export default Routers;
