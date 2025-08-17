/**
 * @module plugins
 */


import { FCapturePlugin } from './capture';
import { FDragPlugin } from './drag/base';
import { FTipsDragPlugin } from './drag/tips';
import { FHomePlugin } from './home';
import { FInfoPlugin } from './info';
import { FConsoleMessagePlugin } from './message/event/console';
import { FCopyMessagePlugin } from './message/event/copy';
import { FVisibilityMessagePlugin } from './message/event/visibility';
import { FHourMessagePlugin } from './message/hour';
import { FMotionMessagePlugin } from './message/motion';
import { FSeasonsMessagePlugin } from './message/seasons';
import { FTalkMessagePlugin } from './message/talk';
import { FQuitPlugin } from './quit';
import { FSwitchModulePlugin } from './switch/module';
import { FSwitchTexturePlugin } from './switch/texture';
import { FHitFramesPlugin } from './frame';

export const plugins = {
  FHomePlugin,
  FDragPlugin,
  FInfoPlugin,
  FQuitPlugin,
  FCapturePlugin,
  FTipsDragPlugin,
  FTestFramePlugin: FHitFramesPlugin,
  FSwitchModulePlugin,
  FSwitchTexturePlugin,
  FHourMessagePlugin,
  FMotionMessagePlugin,
  FSeasonsMessagePlugin,
  FTalkMessagePlugin,
  FCopyMessagePlugin,
  FConsoleMessagePlugin,
  FVisibilityMessagePlugin
};

export * from './base';
export * from './home';
export * from './capture';
export * from './drag/base';
export * from './drag/tips';
export * from './info';
export * from './quit';
export * from './switch/base';
export * from './switch/module';
export * from './switch/texture';
export * from './message/null';
export * from './message/hour';
export * from './message/motion';
export * from './message/seasons';
export * from './message/talk';
export * from './message/event/copy';
export * from './message/event/event';
export * from './message/event/console';
export * from './message/event/visibility';
