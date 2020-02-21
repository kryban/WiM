/*

/// <reference path="../node_modules/@types/react/index.d.ts" />

import React from 'react';

//export class Front extends Component {

export class Front extends Component {
 foo = 'foo';
 bar = '95vh';

 extensionDivStyle = {
    height: '95vh',
};

 emptyDivStyle = {
    height: '10px',
};

 containerStyle = {
    overflow: 'auto',
    height: '90%',
}

Title() {
    return <h1>{this.foo}</h1>;
} 

    FrontComp() {
        return (<div>
            <h1>{this.foo}</h1>
            <div class="modal_allOverlay">&nbsp;</div>
            <div id="vss-bandik-extension" style={this.extensionDivStyle} >
                <div id="pageTitle" class="bandik-ext-title">Workitem Manager </div>
                <div style={this.emptyDivStyle}></div>
                <div style={this.containerStyle}>
                    <div id="sample-container" class="menu-bar"></div>
                    <div class="open-existing-work-item">
                        <label for="existing-wit-id">PBI:</label>
                        <input id="existing-wit-id" value="workitem ID" />
                        <button id="existing-wit-button" type="button" value="Open...">Find</button>
                        <div>
                            <h4 id="existing-wit-text" class="existing-wit-text"></h4>
                        </div>

                        <div id="tasks">
                            <div id="tasksLabel">
                                Add task(s):
            </div><br /><br />
                            <div id="tasks-check-all">
                                <input class="checkbox" type="checkbox" id="tasks-check-all-checkbox" name="checkall" />
                                <label for="tasks-check-all-checkbox">All</label><br /><br />
                            </div>
                            <div id="tasksContainer">
                                <form name="tasksForm">
                                    <fieldset class="checkbox" id="task-checkbox" type="checkbox"></fieldset>
                                </form><br />
                                <button type="button" id="addTasksButton">Add</button>
                            </div>
                        </div>
                        <div id="combo-container"></div>
                    </div>

                    <div class="modal_teams">
                        <div class="modal_teams_overlay"></div>
                        <div class="modal_teams_vertical_offset">
                            <div class="modal_teams_box">
                                <div class="modal_teams_videoWrapper">
                                    <div class="modal_teams_content">
                                        <h2 id="pageTitle">Manage teams</h2>
                                        <div class="input_fields_container_part" id="teamInputFields"></div>
                                        <menu>
                                            <br />
                                            <button id="voegTeamToe" class="btn btn-sm btn-primary voeg_toe">Voeg toe</button>
                                            <button id="teamDialogCancelBtn" value="cancel">Cancel</button>
                                            <button id="teamDialogConfirmBtn" value="default">OK</button>
                                        </menu>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal_tasks">
                        <div class="modal_tasks_overlay"></div>
                        <div class="modal_tasks_vertical_offset">
                            <div class="modal_tasks_box">
                                <div class="modal_tasks_videoWrapper">
                                    <div class="modal_tasks_content">
                                        <h2 id="header">Manage tasks</h2>
                                        <div class="ui-dialog-title" id="header">Team</div>
                                        <select class="teamSelect">
                                            <option selected="selected">select team</option>
                                        </select>
                                        <div class="ui-dialog-title">Tasks</div>
                                        <div class="tasks_input_fields_container_part" id="taskInputFields"></div>
                                        <menu>
                                            <button id="voegTaskToe" class="btn btn-sm btn-primary voeg_task_toe" disabled>Voeg toe</button>
                                            <button id="taskDialogCancelBtn" value="cancel">Cancel</button>
                                            <button id="taskDialogConfirmBtn" value="default" disabled>OK</button>
                                        </menu>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <script>console.log("In HTML");</script>
                    <script type="module" src="ts/witTs.js" />
                </div>
            </div>
        </div>
        )
    }
}
//}

*/