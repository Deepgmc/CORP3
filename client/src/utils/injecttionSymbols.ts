import type { Rbac } from '@/entities/Rbac';
import type NetworkManager from '@/network/NetworkManager';
import type { InjectionKey } from 'vue';

export const rbacSym: InjectionKey<(key: Rbac) => Rbac> = Symbol(); //глобальный rbac (user manager)
export const nmSym: InjectionKey<(key: NetworkManager) => NetworkManager> = Symbol() //глобальный network manager
