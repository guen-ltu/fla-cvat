// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { ActionUnion, createAction, ThunkAction } from 'utils/redux';
import { Model } from 'reducers/interfaces';
import getCore from 'cvat-core-wrapper';

export enum ModelsTrainActionTypes {
    GET_TRAIN_MODELS = 'GET_TRAIN_MODELS',
    GET_TRAIN_MODELS_SUCCESS = 'GET_TRAIN_MODELS_SUCCESS',
    GET_TRAIN_MODELS_FAILED = 'GET_TRAIN_MODELS_FAILED',
    SHOW_TRAIN_MODEL_DIALOG = 'SHOW_TRAIN_MODEL_DIALOG',
    CLOSE_TRAIN_MODEL_DIALOG = 'CLOSE_TRAIN_MODEL_DIALOG',
}

export const modelsTrainActions = {
    getTrainModels: () => createAction(
        ModelsTrainActionTypes.GET_TRAIN_MODELS
    ),
    getTrainModelsSuccess: (models: Model[]) => createAction(ModelsTrainActionTypes.GET_TRAIN_MODELS_SUCCESS, {
        models,
    }),
    getTrainModelsFailed: (error: any) => createAction(ModelsTrainActionTypes.GET_TRAIN_MODELS_FAILED, {
        error,
    }),
    showTrainModelDialog: (taskInstance: any) => (
        createAction(ModelsTrainActionTypes.SHOW_TRAIN_MODEL_DIALOG, {
            taskInstance,
        })
    ),
    closeTrainModelDialog: () => createAction(
        ModelsTrainActionTypes.CLOSE_TRAIN_MODEL_DIALOG
    ),
};

export function startTrainingAsync(taskId: number, model: Model, body: object): ThunkAction {
    return async (dispatch): Promise<void> => {
        alert("Train")
        alert(taskId)
        console.log(taskId)
        console.log(model)
        console.log(body)
        // pass parameters
        // copy full dialog with model and label selection
        // do it via core.lambda or directly to REST?
    };
}

export type ModelsTrainActions = ActionUnion<typeof modelsTrainActions>;

const core = getCore();

export function getTrainModelsAsync(): ThunkAction {
    return async (dispatch): Promise<void> => {
        dispatch(modelsTrainActions.getTrainModels());

        try {
            const models = await core.lambda.list();
            dispatch(modelsTrainActions.getTrainModelsSuccess(models));
        } catch (error) {
            dispatch(modelsTrainActions.getTrainModelsFailed(error));
        }
    };
}
