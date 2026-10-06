import axios from "axios";
import { apiHandler } from "./apiHandler";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/combo`;

export const createCombo = (comboData) => {
    return apiHandler(() =>
        axios.post(API_URL, comboData, { withCredentials: true })
    );
};

export const fetchActiveCombos = (params = {}) => {
    return apiHandler(() => axios.get(API_URL, { params }));
};

export const fetchComboBySlug = (slug) => {
    return apiHandler(() => axios.get(`${API_URL}/${slug}`));
};

export const fetchAllCombosAdmin = (params = {}) => {
    return apiHandler(() =>
        axios.get(`${API_URL}/admin/all`, {
            params,
            withCredentials: true,
        })
    );
};

export const fetchComboById = (id) => {
    return apiHandler(() =>
        axios.get(`${API_URL}/admin/${id}`, {
            withCredentials: true,
        })
    );
};

export const updateCombo = (id, comboData) => {
    return apiHandler(() =>
        axios.patch(`${API_URL}/${id}`, comboData, {
            withCredentials: true,
        })
    );
};

export const deleteCombo = (id) => {
    return apiHandler(() =>
        axios.delete(`${API_URL}/${id}`, {
            withCredentials: true,
        })
    );
};