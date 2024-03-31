/**
 * @module plugins
 */

/**
 * DMessage 的扩展类型, 包括但不限于 DHourMessage, DSeasonsMessage, DEventMessage
 * @summary 消息扩展类型
 * @typedef {DMessage | DHourMessage | DSeasonsMessage | DEventMessage} DMessageExtend
 * @global
 */

import { FCapturePlugin } from './capture.js';
import { FDragPlugin } from './drag/base.js';
import { FTipsDragPlugin } from './drag/tips.js';
import { FHomePlugin } from './home.js';
import { FInfoPlugin } from './info.js';
import { FConsoleMessagePlugin } from './message/event/console.js';
import { FCopyMessagePlugin } from './message/event/copy.js';
import { FVisibilityMessagePlugin } from './message/event/visibility.js';
import { FHourMessagePlugin } from './message/hour.js';
import { FMotionMessagePlugin } from './message/motion.js';
import { FNullMessagePlugin } from './message/null.js';
import { FSeasonsMessagePlugin } from './message/seasons.js';
import { FTalkMessagePlugin } from './message/talk.js';
import { FQuitPlugin } from './quit.js';
import { FSwitchModulePlugin } from './switch/module.js';
import { FSwitchTexturePlugin } from './switch/texture.js';

export const plugins = {
  FHomePlugin,
  FDragPlugin,
  FInfoPlugin,
  FQuitPlugin,
  FCapturePlugin,
  FTipsDragPlugin,
  FSwitchModulePlugin,
  FSwitchTexturePlugin,
  FNullMessagePlugin,
  FHourMessagePlugin,
  FMotionMessagePlugin,
  FSeasonsMessagePlugin,
  FTalkMessagePlugin,
  FCopyMessagePlugin,
  FConsoleMessagePlugin,
  FVisibilityMessagePlugin
};

export * from './base.js';
export * from './home.js';
export * from './capture.js';
export * from './drag/base.js';
export * from './drag/tips.js';
export * from './info.js';
export * from './quit.js';
export * from './switch/base.js';
export * from './switch/module.js';
export * from './switch/texture.js';
export * from './message/null.js';
export * from './message/hour.js';
export * from './message/motion.js';
export * from './message/seasons.js';
export * from './message/talk.js';
export * from './message/event/copy.js';
export * from './message/event/event.js';
export * from './message/event/console.js';
export * from './message/event/visibility.js';
