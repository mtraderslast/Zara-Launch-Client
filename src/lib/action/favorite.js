import axios from "axios";
import { apiHandler } from "./apiHandler";

const FAVORITE_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorite`;

export const toggleFavorite = (productId) => {
    return apiHandler(() =>
        axios.post(
            `${FAVORITE_API_URL}/toggle`,
            { productId },
            { withCredentials: true }
        )
    );
};

export const fetchMyFavorites = () => {
    return apiHandler(() =>
        axios.get(`${FAVORITE_API_URL}/my-favorites`, {
            withCredentials: true,
        })
    );
};

export const checkIsFavorite = (productId) => {
    return apiHandler(() =>
        axios.get(`${FAVORITE_API_URL}/check/${productId}`, {
            withCredentials: true,
        })
    );
};

export const removeFavorite = (productId) => {
    return apiHandler(() =>
        axios.delete(`${FAVORITE_API_URL}/${productId}`, {
            withCredentials: true,
        })
    );
};