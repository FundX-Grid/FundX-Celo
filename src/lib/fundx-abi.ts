export const FUNDX_ABI = [...];

const getAbiFunctionsByType = (abi: any[], type: string) => abi.filter((item: any) => item.type === type);

export const FUNDX_VIEW_FUNCTIONS = getAbiFunctionsByType(FUNDX_ABI, 'function');
export const FUNDX_EVENT_FUNCTIONS = getAbiFunctionsByType(FUNDX_ABI, 'event');