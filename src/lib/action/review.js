import axios from "axios";
import { apiHandler } from "./apiHandler";

const REVIEW_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`;

export const fetchHomeTopReviews = () => {
    return apiHandler(() => axios.get(`${REVIEW_API_URL}/home-page-review`));
};

export const fetchProductReviews = (productId) => {
    return apiHandler(() =>
        axios.get(`${REVIEW_API_URL}/product-review/${productId}`)
    );
};

export const createReview = (reviewData) => {
    return apiHandler(() =>
        axios.post(`${REVIEW_API_URL}/create-review`, reviewData, {
            withCredentials: true,
        })
    );
};

export const updateReview = (reviewId, updateData) => {
    return apiHandler(() =>
        axios.patch(`${REVIEW_API_URL}/${reviewId}`, updateData, {
            withCredentials: true,
        })
    );
};

export const deleteReview = (reviewId) => {
    return apiHandler(() =>
        axios.delete(`${REVIEW_API_URL}/${reviewId}`, {
            withCredentials: true,
        })
    );
};