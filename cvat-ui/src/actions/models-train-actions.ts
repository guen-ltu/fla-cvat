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
    START_TRAINING_FAILED = 'START_TRAINING_FAILED',
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
    startTrainingFailed: (taskID: number, error: any) => (
        createAction(ModelsTrainActionTypes.START_TRAINING_FAILED, {
            taskID,
            error,
        })
    ),
};

export function startTrainingAsync(taskId: number, model: Model, body: object): ThunkAction {
    return async (dispatch): Promise<void> => {
        try {
            const requestID: string = await core.lambda.runTraining(taskId, model, body);
            console.log(requestID)

            // TODO block/notify when a training for the model is already running
            // TODO add listener to notify when training is done

            /*
            const dispatchCallback = (action: ModelsActions): void => {
                dispatch(action);
            };*/

            /*
            listen(
                {
                    taskID: taskId,
                    requestID,
                },
                dispatchCallback,
            );*/
        } catch (error) {
            console.log(error)
            dispatch(modelsTrainActions.startTrainingFailed(taskId, error));
        }
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
