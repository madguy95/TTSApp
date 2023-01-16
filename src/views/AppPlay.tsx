/**
 * @flow
 */
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';
import ListItemPlay from '../components/ListItemPlay';
import DataBatch from '../components/DataBatch';
import {ReferenceDataContext} from '../storage/ReferenceDataContext';
import {PlaylistItem} from '../model/api';
import {loadNew, loadNewData} from '../redux/Actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  ICON_BACK_BUTTON,
  ICON_FORWARD_BUTTON,
  ICON_LOOP_ALL_BUTTON,
  ICON_LOOP_ONE_BUTTON,
  ICON_MUTED_BUTTON,
  ICON_PAUSE_BUTTON,
  ICON_PLAY_BUTTON,
  ICON_STOP_BUTTON,
  ICON_THUMB_1,
  ICON_THUMB_2,
  ICON_TRACK_1,
  ICON_UNMUTED_BUTTON,
} from '../constants/Icon';

Sound.setCategory('Playback');

const PlAYLIST = [
  new PlaylistItem(
    0,
    'Comfort Fit - “Sorry”',
    'https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3',
    false,
  ),
  new PlaylistItem(
    1,
    'Mildred Bailey – “All Of Me”',
    'https://ia800304.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanwithMildredBailey-AllofMe.mp3',
    false,
  ),
  new PlaylistItem(
    2,
    'Podington Bear - “Rubber Robot”',
    'https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Podington_Bear_-_Rubber_Robot.mp3',
    false,
  ),
];

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOOPING_TYPE_ICONS = {0: ICON_LOOP_ALL_BUTTON, 1: ICON_LOOP_ONE_BUTTON};

const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFF8ED';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = '... loading ...';
const BUFFERING_STRING = '...buffering...';
const RATE_SCALE = 3.0;
const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - FONT_SIZE * 2;
type MyProps = {
  arrString: [];
  nextURL: string;
  selector: string;
  nextSelector: string;
  limitSplit: number;
  actions: any;
};
type MyState = {
  index: number;
  isSeeking: boolean;
  showVideo: boolean;
  playbackInstanceName: string;
  loopingType: number;
  muted: boolean;
  playbackInstancePosition: number | null;
  playbackInstanceDuration: number | null;
  shouldPlay: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  isLoading: boolean;
  fontLoaded: boolean;
  shouldCorrectPitch: boolean;
  volume: number;
  rate: number;
  videoWidth: number;
  videoHeight: number;
  poster: boolean;
  useNativeControls: boolean;
  fullscreen: boolean;
  throughEarpiece: boolean;
  playList: PlaylistItem[];
  content: [];
  playState: string;
};
class AppPlay extends React.Component<MyProps | never, MyState> {
  static contextType = ReferenceDataContext;
  index: number;
  shouldPlayAtEndOfSeek: boolean;
  playbackInstance: Sound | null;
  timeout!: NodeJS.Timer;
  playList: PlaylistItem[];
  constructor(props: MyProps) {
    super(props);
    this.index = 0;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.playList = PlAYLIST;
    this.state = {
      index: 0,
      isSeeking: false,
      showVideo: false,
      playbackInstanceName: LOADING_STRING,
      loopingType: LOOPING_TYPE_ALL,
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      videoWidth: DEVICE_WIDTH,
      videoHeight: VIDEO_CONTAINER_HEIGHT,
      poster: false,
      useNativeControls: false,
      fullscreen: false,
      throughEarpiece: false,
      playList: PlAYLIST,
      content: [],
      playState: 'paused',
    };
  }

  componentDidMount() {
    this._loadNewPlaybackInstance(false);
    this.setState({fontLoaded: true});
    this.timeout = setInterval(() => {
      if (
        this.playbackInstance &&
        this.playbackInstance.isLoaded() &&
        this.state.playState == 'playing' &&
        !this.state.isSeeking
      ) {
        this.playbackInstance.getCurrentTime((seconds: any, isPlaying: any) => {
          if (this.playbackInstance && isPlaying) {
            this.setState({
              playbackInstancePosition: seconds,
            });
          }
        });
      }
    }, 500);
  }

  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<{}>,
    snapshot?: any,
  ): void {
    // console.log(this.context?.data?.content ? 'DidUpdate' : '');
    
    if (
      this.props.arrString &&
      JSON.stringify(this.props.arrString) !=
        JSON.stringify(this.state.content) &&
      Array.isArray(this.props.arrString) &&
      this.props.arrString.length > 0
    ) {
      // console.log(this.props.arrString);
      const arrPlay = new Array();
      // arrPlay.push(...this.state.playList);
      this.props.arrString.forEach((item: string, index: number) => {
        arrPlay.push(new PlaylistItem(index, item, '', false));
      });
      // if (JSON.stringify(arrPlay) != JSON.stringify(this.state.playList)) {
      this.playList = arrPlay;
      this.index = 0;
      this.setState({
        playList: arrPlay,
        content: this.props.arrString,
        index: 0,
      });
      // reset lai trang thai player khi load text moi
      this._onStopPressed();
      this._loadNewPlaybackInstance(this.state.isPlaying);
      // }
    }
  }

  componentWillUnmount() {
    if (this.playbackInstance) {
      this.playbackInstance.release();
      this.playbackInstance = null;
    }
    if (this.timeout) {
      clearInterval(this.timeout);
    }
  }

  playComplete = (success: any) => {
    if (this.playbackInstance) {
      if (success) {
        console.log('successfully finished playing');
        // neu lap 1 bai thi ko lam gi
        if (this.state.loopingType == LOOPING_TYPE_ALL) {
          this.setState({playState: 'paused'});
          this.playbackInstance.setCurrentTime(0);
          if (this.state.isPlaying && this.index == this.playList.length - 1) {
            console.log('call load new data');
            this.props.actions.loadNewData(
              this.props.nextURL,
              this.props.selector,
              this.props.nextSelector,
              this.props.limitSplit,
            );
          } else {
            this._advanceIndex(true);
            // lap lai tat ca den cuoi bai se quay ve dau va ko play tiep
            if (this.index == 0) {
              this.setState({isPlaying: false});
              this._updatePlaybackInstanceForIndex(false);
            } else {
              this._updatePlaybackInstanceForIndex(true);
            }
          }
        }
      } else {
        console.log('playback failed due to audio decoding errors');
        Alert.alert('Notice', 'audio file error. (Error code : 2)');
      }
    }
  };

  callPlay = () => {
    this.setState({
      playState: 'playing',
      isPlaying: true,
    });
    this.playbackInstance?.setNumberOfLoops(
      this.state.loopingType == LOOPING_TYPE_ALL ? 0 : -1,
    );
    this.playbackInstance?.setVolume(this.state.volume);
    this.playbackInstance?.play(this.playComplete);
    // set spleed after play , because can get issue onEnd not called
    this.playbackInstance?.setSpeed(this.state.rate);
  };

  setPlayList(playListArr: any) {
    console.log("set playlist")
    this.playList = playListArr;
    if (this.playbackInstance == null) {
      this._loadNewPlaybackInstance(this.state.shouldPlay);
    }
  }

  async _loadNewPlaybackInstance(playing: boolean) {
    console.log("call _loadNewPlaybackInstance: " + playing);
    if (this.playbackInstance) {
      this.playbackInstance.release();
      this.playbackInstance = null;
    }
    const uri = this.playList[this.index]?.uri;
    this.setState({index: this.index, isLoading: true, shouldPlay: playing});
    console.log(`index ${this.index} uri ${uri} `);
    if (uri && uri != '') {
      console.log('[Play]', playing, uri);
      this.playbackInstance = await new Sound(uri, undefined, error => {
        this._updateScreenForLoading(false);
        if (error) {
          console.log('failed to load the sound', error);
          Alert.alert('Notice', 'audio file error. (Error code : 1)');
          this.setState({playState: 'paused'});
        } else {
          this.setState({
            playbackInstancePosition: 0,
            playbackInstanceDuration: this.playbackInstance
              ? this.playbackInstance.getDuration()
              : 0,
          });
          this.playbackInstance?.setVolume(this.state.volume);
          if (playing) {
            this.callPlay();
          }
        }
      });
    }
  }

  _updateScreenForLoading(isLoading: boolean) {
    if (isLoading) {
      this.setState({
        showVideo: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true,
      });
    } else {
      this.setState({
        playbackInstanceName: this.state.playList[this.index].name,
        showVideo: this.state.playList[this.index].isVideo,
        isLoading: false,
      });
    }
  }

  _onReadyForDisplay = (event: {
    naturalSize: {height: number; width: number};
  }) => {
    const widestHeight =
      (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width;
    if (widestHeight > VIDEO_CONTAINER_HEIGHT) {
      this.setState({
        videoWidth:
          (VIDEO_CONTAINER_HEIGHT * event.naturalSize.width) /
          event.naturalSize.height,
        videoHeight: VIDEO_CONTAINER_HEIGHT,
      });
    } else {
      this.setState({
        videoWidth: DEVICE_WIDTH,
        videoHeight:
          (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width,
      });
    }
  };

  _onFullscreenUpdate = (event: {fullscreenUpdate: any}) => {
    console.log(
      `FULLSCREEN UPDATE : ${JSON.stringify(event.fullscreenUpdate)}`,
    );
  };

  _advanceIndex(forward: boolean) {
    this.index =
      (this.index + (forward ? 1 : this.state.playList.length - 1)) %
      this.state.playList.length;
    this.setState({index: this.index});
  }

  async _updatePlaybackInstanceForIndex(playing: boolean) {
    this._updateScreenForLoading(true);

    this.setState({
      videoWidth: DEVICE_WIDTH,
      videoHeight: VIDEO_CONTAINER_HEIGHT,
    });

    this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pause();
      } else {
        this.callPlay();
      }
      this.setState({
        isPlaying: !this.state.isPlaying,
        shouldPlay: !this.state.isPlaying,
      });
    }
  };

  _onStopPressed = () => {
    if (this.playbackInstance != null) {
      this.playbackInstance.stop();
      this.setState({
        showVideo: false,
        shouldPlay: false,
        isPlaying: false,
        playbackInstancePosition: 0,
      });
    }
  };

  _onForwardPressed = () => {
    if (this.playbackInstance != null) {
      this._advanceIndex(true);
      this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
    }
  };

  _onBackPressed = () => {
    if (this.playbackInstance != null) {
      this._advanceIndex(false);
      this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
    }
  };

  _onMutePressed = () => {
    if (this.playbackInstance != null) {
      if (!this.state.muted) {
        this.playbackInstance.setVolume(0);
      } else {
        this.playbackInstance.setVolume(this.state.volume);
      }
    }
    this.setState({muted: !this.state.muted});
  };

  _onLoopPressed = () => {
    // doi kieu lap
    const loopingType =
      this.state.loopingType == LOOPING_TYPE_ONE
        ? LOOPING_TYPE_ALL
        : LOOPING_TYPE_ONE;
    if (this.playbackInstance != null) {
      this.playbackInstance.setNumberOfLoops(
        loopingType == LOOPING_TYPE_ALL ? 0 : -1,
      );
    }
    this.setState({loopingType: loopingType});
  };

  _onVolumeSliderValueChange = (value: any) => {
    this.setState({volume: value});
    if (this.playbackInstance != null) {
      this.playbackInstance.setVolume(value);
    }
  };

  _trySetRate = (rate: any, shouldCorrectPitch: boolean) => {
    this.setState({rate: rate});
    if (this.playbackInstance && this.playbackInstance.isPlaying()) {
      try {
        this.playbackInstance.setSpeed(rate);
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  _onRateSliderSlidingComplete = async (value: number) => {
    this._trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch);
  };

  _onPitchCorrectionPressed = async (value: any) => {
    this._trySetRate(this.state.rate, !this.state.shouldCorrectPitch);
  };

  _onSeekSliderValueChange = (value: any) => {
    if (this.playbackInstance != null && !this.state.isSeeking) {
      this.setState({isSeeking: true});
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.playbackInstance.pause();
    }
  };

  _onSeekSliderSlidingComplete = async (value: number) => {
    if (this.playbackInstance != null) {
      this.setState({isSeeking: false});
      const seekPosition = value * (this.state.playbackInstanceDuration || 0);
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.setCurrentTime(seekPosition);
        this.callPlay();
      } else {
        this.playbackInstance.setCurrentTime(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      const seek =
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration;
      return isNaN(seek) ? 0 : seek;
    }
    return 0;
  }

  _getMMSSFromMillis(millis: any) {
    const totalSeconds = millis;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number: number) => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  _getTimestamp() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.playbackInstancePosition,
      )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
    }
    return '';
  }

  _onPosterPressed = () => {
    this.setState({poster: !this.state.poster});
  };

  _onUseNativeControlsPressed = () => {
    this.setState({useNativeControls: !this.state.useNativeControls});
  };

  _onFullscreenPressed = () => {
    //  try {
    //    this._video.presentFullscreenPlayer();
    //  } catch (error) {
    //    console.log(error.toString());
    //  }
  };

  _onSpeakerPressed = () => {
    //  this.setState(
    //    state => {
    //      return { throughEarpiece: !state.throughEarpiece };
    //    },
    //    () =>
    //      Audio.setAudioModeAsync({
    //        allowsRecordingIOS: false,
    //        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    //        playsInSilentModeIOS: true,
    //        shouldDuckAndroid: true,
    //        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    //        playThroughEarpieceAndroid: this.state.throughEarpiece
    //      })
    //  );
  };

  _onChangeSelect = (id: any) => {
    this.index = id;
    this.setState({index: id});
    if (this.playbackInstance != null) {
      console.log(this.state.shouldPlay);
      this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
    }
  };

  render() {
    return !this.state.fontLoaded ? (
      <View style={styles.emptyContainer} />
    ) : (
      <View style={styles.container}>
        <View />
        <View style={styles.nameContainer}>
          <Text style={[styles.text]}>{this.state.playbackInstanceName}</Text>
        </View>
        {/* <View style={styles.space} /> */}
        <View style={styles.videoContainer}>
          <View
            style={{
              width: this.state.videoWidth,
              height: this.state.videoHeight,
            }}>
            <ListItemPlay
              data={this.playList}
              onChange={this._onChangeSelect}
              idSelected={this.state.index}
            />
            <DataBatch
              idSelected={this.state.index}
              playList={this.state.playList}
              setPlayList={this.setPlayList.bind(this)}
            />
          </View>
        </View>
        <View
          style={[
            styles.playbackContainer,
            {
              opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
            },
          ]}>
          <Slider
            style={styles.playbackSlider}
            {...(Platform.OS === 'ios' && {trackImage: ICON_TRACK_1.module})}
            thumbImage={ICON_THUMB_1.module}
            maximumTrackTintColor="#A6AFB1"
            minimumTrackTintColor='#3C4142'
            value={this._getSeekSliderPosition()}
            onSlidingStart={this._onSeekSliderValueChange}
            onSlidingComplete={this._onSeekSliderSlidingComplete}
            disabled={this.state.isLoading}
          />
          <View style={styles.timestampRow}>
            <Text
              style={[
                styles.text,
                styles.buffering,
                // {fontFamily: 'cutive-mono-regular'},
              ]}>
              {this.state.isBuffering ? BUFFERING_STRING : ''}
            </Text>
            <Text
              style={[
                styles.text,
                styles.timestamp,
                // {fontFamily: 'cutive-mono-regular'},
              ]}>
              {this._getTimestamp()}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.buttonsContainerBase,
            styles.buttonsContainerTopRow,
            {
              opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
            },
          ]}>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={this._onBackPressed}
            disabled={this.state.isLoading}>
            <Image style={styles.button} source={ICON_BACK_BUTTON.module} />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={this._onPlayPausePressed}
            disabled={this.state.isLoading}>
            <Image
              style={styles.button}
              source={
                this.state.isPlaying
                  ? ICON_PAUSE_BUTTON.module
                  : ICON_PLAY_BUTTON.module
              }
            />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={this._onStopPressed}
            disabled={this.state.isLoading}>
            <Image style={styles.button} source={ICON_STOP_BUTTON.module} />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={this._onForwardPressed}
            disabled={this.state.isLoading}>
            <Image style={styles.button} source={ICON_FORWARD_BUTTON.module} />
          </TouchableHighlight>
        </View>
        <View
          style={[
            styles.buttonsContainerBase,
            styles.buttonsContainerMiddleRow,
          ]}>
          <View style={styles.volumeContainer}>
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={this._onMutePressed}>
              <Image
                style={styles.button}
                source={
                  this.state.muted
                    ? ICON_MUTED_BUTTON.module
                    : ICON_UNMUTED_BUTTON.module
                }
              />
            </TouchableHighlight>
            <Slider
              style={styles.volumeSlider}
              {...(Platform.OS === 'ios' && {trackImage: ICON_TRACK_1.module})}
              thumbImage={ICON_THUMB_2.module}
              maximumTrackTintColor="#A6AFB1"
              minimumTrackTintColor='#3C4142'
              value={1}
              onValueChange={this._onVolumeSliderValueChange}
            />
            <Text>{Math.floor(this.state.volume * 100)}</Text>
          </View>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={this._onLoopPressed}>
            <Image
              style={styles.button}
              source={
                LOOPING_TYPE_ICONS[
                  this.state.loopingType as keyof typeof LOOPING_TYPE_ICONS
                ].module
              }
            />
          </TouchableHighlight>
        </View>
        <View
          style={[
            styles.buttonsContainerBase,
            styles.buttonsContainerBottomRow,
          ]}>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={() =>
              this._trySetRate(1.0, this.state.shouldCorrectPitch)
            }>
            <View style={styles.button}>
              <Text style={[styles.text]}>Rate:</Text>
            </View>
          </TouchableHighlight>
          <Slider
            style={styles.rateSlider}
            {...(Platform.OS === 'ios' && {trackImage: ICON_TRACK_1.module})}
            thumbImage={ICON_THUMB_1.module}
            maximumTrackTintColor="#A6AFB1"
            minimumTrackTintColor='#3C4142'
            value={this.state.rate / RATE_SCALE}
            onSlidingComplete={this._onRateSliderSlidingComplete}
          />
          <Text>{this.state.rate?.toFixed(2)}</Text>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={this._onPitchCorrectionPressed}>
            <View style={styles.button}>
              <Text style={[styles.text]}>
                PC: {this.state.shouldCorrectPitch ? 'yes' : 'no'}
              </Text>
            </View>
          </TouchableHighlight>
          {/*<TouchableHighlight
             onPress={this._onSpeakerPressed}
             underlayColor={BACKGROUND_COLOR}
           >
              <MaterialIcons
               name={
                 this.state.throughEarpiece
                   ? ICON_THROUGH_EARPIECE
                   : ICON_THROUGH_SPEAKER
               }
               size={32}
               color="black"
             />
           </TouchableHighlight>*/}
        </View>
        <View />
        {this.state.showVideo ? (
          <View>
            <View
              style={[
                styles.buttonsContainerBase,
                styles.buttonsContainerTextRow,
              ]}>
              <View />
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onPosterPressed}>
                <View style={styles.button}>
                  <Text style={[styles.text]}>
                    Poster: {this.state.poster ? 'yes' : 'no'}
                  </Text>
                </View>
              </TouchableHighlight>
              <View />
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onFullscreenPressed}>
                <View style={styles.button}>
                  <Text style={[styles.text]}>Fullscreen</Text>
                </View>
              </TouchableHighlight>
              <View />
            </View>
            <View style={styles.space} />
            <View
              style={[
                styles.buttonsContainerBase,
                styles.buttonsContainerTextRow,
              ]}>
              <View />
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onUseNativeControlsPressed}>
                <View style={styles.button}>
                  <Text style={[styles.text]}>
                    Native Controls:{' '}
                    {this.state.useNativeControls ? 'yes' : 'no'}
                  </Text>
                </View>
              </TouchableHighlight>
              <View />
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  needLoad: state.reducer.needLoad,
  selector: state.reducer.selector,
  nextSelector: state.reducer.nextSelector,
  limitSplit: state.reducer.limitSplit,
  nextURL: state.reducer.nextURL,
  arrString: state.reducer.arrString,
});

const ActionCreators = Object.assign({}, {loadNew, loadNewData});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppPlay);

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
  },
  wrapper: {},
  nameContainer: {
    height: FONT_SIZE,
  },
  space: {
    height: FONT_SIZE,
  },
  videoContainer: {
    height: VIDEO_CONTAINER_HEIGHT,
  },
  video: {
    maxWidth: DEVICE_WIDTH,
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: ICON_THUMB_1.height * 2.0,
    maxHeight: ICON_THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },
  timestampRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    minHeight: FONT_SIZE,
  },
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE * 2,
    lineHeight: FONT_SIZE,
    overflow: 'hidden',
    color: 'dimgrey',
    // whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  buffering: {
    textAlign: 'left',
    paddingLeft: 20,
  },
  timestamp: {
    textAlign: 'right',
    paddingRight: 20,
  },
  button: {
    backgroundColor: BACKGROUND_COLOR,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainerTopRow: {
    maxHeight: ICON_PLAY_BUTTON.height,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerMiddleRow: {
    maxHeight: ICON_MUTED_BUTTON.height,
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width,
  },
  buttonsContainerBottomRow: {
    maxHeight: ICON_THUMB_1.height,
    alignSelf: 'stretch',
    paddingRight: 20,
    paddingLeft: 20,
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerTextRow: {
    maxHeight: FONT_SIZE,
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20,
    minWidth: DEVICE_WIDTH,
    maxWidth: DEVICE_WIDTH,
  },
});
