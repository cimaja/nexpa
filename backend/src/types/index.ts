import { Payload } from 'payload';

export interface PayloadRequest {
  payload: Payload;
  user?: {
    id: string;
    collection: string;
    [key: string]: any;
  };
}

export interface BeforeChangeHook {
  data: any;
  req?: PayloadRequest;
  operation: 'create' | 'update';
  originalDoc?: any;
  [key: string]: any;
}

export interface AfterChangeHook {
  doc: any;
  req: PayloadRequest;
  previousDoc?: any;
  operation: 'create' | 'update' | 'delete';
  [key: string]: any;
}

export interface AccessArgs {
  req: PayloadRequest;
  id?: string;
  data?: any;
  [key: string]: any;
}

export interface HookArgs {
  data?: any;
  req?: PayloadRequest;
  operation?: 'create' | 'update' | 'delete';
  [key: string]: any;
}

export interface SiblingData {
  [key: string]: any;
}
