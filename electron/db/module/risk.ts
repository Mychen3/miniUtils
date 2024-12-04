import { db } from '../database';
import { insertRiskDictSql, deleteRiskDictSql } from '../sql';
import { IpcMainInvokeEvent } from 'electron';

export type RiskDictItem = {
  risk_value: string;
  risk_status: string;
  risk_id: number;
};

const addRiskDict = async (_event: IpcMainInvokeEvent, params: { riskStatus: string; riskValue: string }) => {
  try {
    const stmt = db.prepare(insertRiskDictSql);
    await stmt.run(params.riskStatus, params.riskValue);
    return true;
  } catch (error) {
    throw error;
  }
};

const getRiskDictList = async (_event: IpcMainInvokeEvent) => {
  try {
    const stmt = db.prepare(`SELECT * FROM risk_dict`);
    return stmt.all();
  } catch (error) {
    throw error;
  }
};

const deleteRiskDict = async (_event: IpcMainInvokeEvent, params: { risk_id: number }) => {
  try {
    const stmt = db.prepare(deleteRiskDictSql);
    await stmt.run(params.risk_id);
    return true;
  } catch (error) {
    throw error;
  }
};

export { addRiskDict, getRiskDictList, deleteRiskDict };
