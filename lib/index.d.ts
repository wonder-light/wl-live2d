import { Application } from 'pixi.js';
import type { InternalModel, Live2DModel } from 'pixi-live2d-display';

type TApplication = Application & GlobalMixins.Application;
type TLive2DModel = Live2DModel<InternalModel>;
