import DataManager from './DataManager';
import { PlayData, defaultPlayData } from './PlayData';

const PlayDataUtil = new DataManager<PlayData>(defaultPlayData,'playData', '');
export default PlayDataUtil;

(window as any).PlayDataUtil = PlayDataUtil;