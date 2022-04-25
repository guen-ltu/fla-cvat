// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal';

import { ThunkDispatch } from 'utils/redux';
import { modelsTrainActions, startTrainingAsync } from 'actions/models-train-actions';
import { Model, CombinedState } from 'reducers/interfaces';
import DetectorRunner from './detector-train-runner';

interface StateToProps {
    visible: boolean;
    task: any;
    detectors: Model[];
    reid: Model[];
}

interface DispatchToProps {
    runTraining(task: any, model: Model, body: object): void;
    closeDialog(): void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const { modelsTrain } = state;
    const { detectors, reid } = modelsTrain;

    return {
        visible: modelsTrain.modelTrainIsVisible,
        task: modelsTrain.modelTrainTask,
        reid,
        detectors,
    };
}

function mapDispatchToProps(dispatch: ThunkDispatch): DispatchToProps {
    return {
        runTraining(taskID: number, model: Model, body: object) {
            dispatch(startTrainingAsync(taskID, model, body));
        },
        closeDialog() {
            dispatch(modelsTrainActions.closeTrainModelDialog());
        },
    };
}

function ModelTrainModal(props: StateToProps & DispatchToProps): JSX.Element {
    const {
        reid, detectors, task, visible, runTraining, closeDialog,
    } = props;

    const models = [...reid, ...detectors];

    return (
        <Modal
            destroyOnClose
            visible={visible}
            footer={[]}
            onCancel={(): void => closeDialog()}
            maskClosable
            title='Train Model'
        >
            { task ? (
                <DetectorRunner
                    withCleanup
                    models={models}
                    labels={task.labels}
                    dimension={task.dimension}
                    runTraining={(...args) => {
                        closeDialog();
                        runTraining(task.id, ...args);
                    }}
                />
            ) : null }
        </Modal>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelTrainModal);
