/**
 * @module plugins
 */

import { FCapturePlugin } from './capture.js';
import { FDragPlugin } from './drag/base.js';
import { FTipsDragPlugin } from './drag/tips.js';
import { FInfoPlugin } from './info.js';
import { FHourMessagePlugin } from './message/hour.js';
import { FNullMessagePlugin } from './message/null.js';
import { FSeasonsMessagePlugin } from './message/seasons.js';
import { FSentenceMessagePlugin } from './message/sentence.js';
import { FQuitPlugin } from './quit.js';
import { FSwitchModulePlugin } from './switch/module.js';
import { FSwitchTexturePlugin } from './switch/texture.js';

export const plugins = {
  FCapturePlugin,
  FDragPlugin,
  FInfoPlugin,
  FQuitPlugin,
  FTipsDragPlugin,
  FSwitchModulePlugin,
  FSwitchTexturePlugin,
  FNullMessagePlugin,
  FHourMessagePlugin,
  FSeasonsMessagePlugin,
  FSentenceMessagePlugin
};

export * from './base.js';
export * from './capture.js';
export * from './drag/base.js';
export * from './info.js';
export * from './quit.js';
export * from './switch/base.js';
export * from './switch/module.js';
export * from './switch/texture.js';
export * from './message/null.js';
export * from './message/hour.js';
export * from './message/seasons.js';
export * from './message/sentence.js';
export * from './drag/tips.js';
