import Artyom from 'artyom.js';

import { Service } from './core/service';
import { Inject } from 'services/core/injector';
import { ScenesService, SceneItem } from 'services/scenes';
import { EditorCommandsService } from './editor-commands';
import { StreamInfoService } from './stream-info';

const artyom = new Artyom();

export class VoiceService extends Service {
  @Inject() scenesService: ScenesService;
  @Inject() editorCommandsService: EditorCommandsService;
  @Inject() streamInfoService: StreamInfoService;

  start() {
    artyom.initialize({
      lang: 'en-US',
      continuous: true,
      listen: true,
      debug: true,
      obeyKeyword: 'kevin',
      speed: 1,
    });

    artyom.dontObey();

    this.addCommands();

    // setTimeout(() => {
    //   artyom.simulateInstruction('play despacito');
    // }, 10000);
    // setTimeout(() => {
    //   artyom.simulateInstruction('set title to meme stream');
    // }, 10000);
  }

  addCommands() {
    // var i returns the index of the recognized command in the indexes array
    const commands = [
      {
        description: '',
        smart: true,
        // Ways to trigger the command with the voice
        indexes: ['set title to *'],
        // Do something when the commands is triggered
        action: (i: number, wildcard: string) => this.setTitle(i, wildcard),
      },
      {
        description: '',
        indexes: ['play despacito'],
        action: (i: number) => this.playDespacito(i),
      },
    ];

    artyom.addCommands(commands);
  }

  setTitle(_i: number, wildcard: String) {
    const titleText = wildcard.trim();
    const { game, description, tags } = this.streamInfoService.state.channelInfo;
    this.streamInfoService.setStreamInfo(titleText, description, game, tags);

    artyom.say(`You got it. Stream title changed to ${titleText}`);

    artyom.dontObey();
  }

  playDespacito(i: number) {
    const sceneItem = this.scenesService
      .getSceneItems()
      .find((item: SceneItem) => item.name === 'Despacito');
    const selection = this.scenesService.activeScene.getSelection([sceneItem.id]);
    if (sceneItem) {
      this.editorCommandsService.executeCommand('HideItemsCommand', selection, false);
    }

    artyom.dontObey();
  }
}
