import { DataProvider } from '@refinedev/core';
import api from '../utils/api';

const dataProvider: DataProvider = {
  getApiUrl: function (): string {
    return 'http://localhost:8080/api';
  },
  getList: async ({ resource, pagination, filters, sort }) => {
    const { current = 1, pageSize = 10 } = pagination || {};
    const response = await api.get(`/${resource}`, {
      params: {
        page: current,
        limit: pageSize,
      },
    });

    return {
      data: response.data.data,
      total: response.data.total,
    };
  },
  getOne: async ({ resource, id }) => {
    const response = await api.get(`/${resource}/${id}`);
    return {
      data: response.data,
    };
  },
  create: async ({ resource, variables }) => {
    const response = await api.post(`/${resource}`, variables);
    return {
      data: response.data,
    };
  },
  update: async ({ resource, id, variables }) => {
    if (id) {
      const response = await api.put(`/${resource}/${id}`, variables);
      return {
        data: response.data,
      };
    } else {
      const response = await api.put(`/${resource}`, variables);
      return {
        data: response.data,
      };
    }
  },
  deleteOne: async ({ resource, id }) => {
    const response = await api.delete(`/${resource}/${id}`);
    return {
      data: response.data,
    };
  },
  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    let axiosResponse;
    switch (method) {
      case 'put':
      case 'post':
      case 'patch':
        axiosResponse = await api[method](url, payload);
        break;
      case 'delete':
        axiosResponse = await api.delete(url, {
          data: payload,
        });
        break;
      default:
        axiosResponse = await api.get(url);
        break;
    }

    const { data } = axiosResponse;

    return {
      data,
    };
  },
};

export default dataProvider;
