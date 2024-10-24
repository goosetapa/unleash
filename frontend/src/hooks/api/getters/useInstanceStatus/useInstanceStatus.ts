import { IInstanceStatus, InstancePlan, InstanceState } from 'interfaces/instance';
import { useApiGetter } from 'hooks/api/getters/useApiGetter/useApiGetter';
import { formatApiPath } from 'utils/formatPath';
import useUiConfig from 'hooks/api/getters/useUiConfig/useUiConfig';

export interface IUseInstanceStatusOutput {
    instanceStatus?: IInstanceStatus;
    refetchInstanceStatus: () => void;
    refresh: () => Promise<void>;
    isBilling: boolean;
    loading: boolean;
    error?: Error;
}

export const useInstanceStatus = (): IUseInstanceStatusOutput => {
    const { uiConfig } = useUiConfig();
    const {
        flags: { UNLEASH_CLOUD },
    } = uiConfig;

    const { data, refetch, loading, error } = useApiGetter(
        ['useInstanceStatus', UNLEASH_CLOUD],
        () => fetchInstanceStatus(UNLEASH_CLOUD)
    );

    const billingPlans = [
        InstancePlan.PRO,
        InstancePlan.COMPANY,
        InstancePlan.TEAM,
    ];

    const refresh = async (): Promise<void> => {
        await fetch(formatApiPath('api/instance/refresh'));
    };

    return {
        instanceStatus: data,
        refetchInstanceStatus: refetch,
        refresh,
        isBilling: billingPlans.includes(data?.plan ?? InstancePlan.UNKNOWN),
        loading,
        error,
    };
};

const fetchInstanceStatus = async (
    UNLEASH_CLOUD?: boolean
): Promise<IInstanceStatus> => {
    // if (!UNLEASH_CLOUD) {
    //     return UNKNOWN_INSTANCE_STATUS;
    // }

    // 실제 API 호출 대신 하드코딩된 값 반환
    return {
        plan: InstancePlan.PRO,
        state: InstanceState.ACTIVE,
        seats: 5,
        trialExpiry: "2034-04-20T00:00:00.000Z",
        trialStart: "2024-03-20T00:00:00.000Z",
        billingCenter: "stripe",
        trialExtended: 0
    };

    // 기존 API 호출 코드는 주석 처리
    // const res = await fetch(formatApiPath('api/instance/status'));
    // if (!res.ok) {
    //     return UNKNOWN_INSTANCE_STATUS;
    // }
    // return res.json();
};

export const UNKNOWN_INSTANCE_STATUS: IInstanceStatus = {
    plan: InstancePlan.UNKNOWN,
};
