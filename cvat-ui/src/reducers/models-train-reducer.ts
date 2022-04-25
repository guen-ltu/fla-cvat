// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { BoundariesActions, BoundariesActionTypes } from 'actions/boundaries-actions';
import { ModelsTrainActionTypes, ModelsTrainActions } from 'actions/models-train-actions';
import { AuthActionTypes, AuthActions } from 'actions/auth-actions';
import { ModelsTrainState, Model } from './interfaces';

const defaultState: ModelsTrainState = {
    initialized: false,
    fetching: false,
    creatingStatus: '',
    detectors: [],
    reid: [],
    modelTrainIsVisible: false,
    modelTrainTask: null,
};

export default function (state = defaultState, action: ModelsTrainActions | AuthActions | BoundariesActions): ModelsTrainState {
    switch (action.type) {
        case ModelsTrainActionTypes.GET_TRAIN_MODELS: {
            return {
                ...state,
                initialized: false,
                fetching: true,
            };
        }
        case ModelsTrainActionTypes.GET_TRAIN_MODELS_SUCCESS: {
            return {
                ...state,
                detectors: action.payload.models.filter((model: Model) => ['detector'].includes(model.type)),
                reid: action.payload.models.filter((model: Model) => ['reid'].includes(model.type)),
                initialized: true,
                fetching: false,
            };
        }
        case ModelsTrainActionTypes.GET_TRAIN_MODELS_FAILED: {
            return {
                ...state,
                initialized: true,
                fetching: false,
            };
        }
        case ModelsTrainActionTypes.SHOW_TRAIN_MODEL_DIALOG: {
            return {
                ...state,
                modelTrainIsVisible: true,
                modelTrainTask: action.payload.taskInstance,
            };
        }
        case ModelsTrainActionTypes.CLOSE_TRAIN_MODEL_DIALOG: {
            return {
                ...state,
                modelTrainIsVisible: false,
                modelTrainTask: null,
            };
        }
        case BoundariesActionTypes.RESET_AFTER_ERROR:
        case AuthActionTypes.LOGOUT_SUCCESS: {
            return { ...defaultState };
        }
        default:
            return state;
    }
};
