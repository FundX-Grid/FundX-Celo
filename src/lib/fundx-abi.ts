export const FUNDX_ABI = [...];

const getAbiFunctionsByType = (abi: any[], type: string) => abi.filter((item: any) => item.type === type);

export const FUNDX_VIEW_FUNCTIONS = getAbiFunctionsByType(FUNDX_ABI, 'function').filter((item: any) => item.stateMutability === 'view');
export const FUNDX PURE_FUNCTIONS = getAbiFunctionsByType(FUNDX_ABI, 'function').filter((item: any) => item.stateMutability === 'pure');
export const FUNDX_EVENTS = getAbiFunctionsByType(FUNDX_ABI, 'event');