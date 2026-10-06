import axios from "axios";
import { apiHandler } from "./apiHandler";

const ORDER_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order`;

export const createOrder = (orderData) => {
    return apiHandler(() => axios.post(`${ORDER_API_URL}/create-order`, orderData));
};

export const trackGuestOrder = (trackingId) => {
    return apiHandler(() =>
        axios.get(`${ORDER_API_URL}/track`, {
            params: { trackingId },
        })
    );
};

export const fetchAllOrders = (params = {}) => {
    return apiHandler(() =>
        axios.get(ORDER_API_URL, {
            params,
            withCredentials: true,
        })
    );
};

export const fetchSingleOrder = (orderId) => {
    return apiHandler(() =>
        axios.get(`${ORDER_API_URL}/${orderId}`, {
            withCredentials: true,
        })
    );
};

export const updateOrderStatus = (orderId, statusData) => {
    return apiHandler(() =>
        axios.patch(`${ORDER_API_URL}/${orderId}/status`, statusData, {
            withCredentials: true,
        })
    );
};

export const deleteOrder = (orderId) => {
    return apiHandler(() =>
        axios.delete(`${ORDER_API_URL}/${orderId}`, {
            withCredentials: true,
        })
    );
};