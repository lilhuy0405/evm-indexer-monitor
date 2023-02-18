import axios from "axios"
import axiosClient from "./axiosClients"

const indexerApi = {

    getCounters: async (): Promise<any> => {
        const url = '/counters'
        const resp = await axiosClient.get(url);
        return resp;
    },

    getCongfigs: async (): Promise<any> => {
        const url = '/configs';
        const resp = await axiosClient.get(url);
        return resp;
    },

    setConfigs: async (config: { key: string, value: any }) => {
        const url = '/configs';
        const resp = await axiosClient.post(url, config);
        return resp;

    },

    getRabbitMQ: async (): Promise<any> => {
        const url = '/rabbitmq';
        const resp = await axiosClient.get(url);
        return resp;
    }
}

export default indexerApi