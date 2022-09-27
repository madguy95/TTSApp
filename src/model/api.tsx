
export declare type Api = {
  id: number,
  url: string,
  urlAudio: string,
  queryString: string,
  body: string,
  method: string,
  content: []
}

export class PlaylistItem {
id: number;
uri: string;
name: any;
thumbnailUrl: string | undefined;
title: any;
isVideo: boolean;
constructor(id: any , name: any, uri: string, isVideo: any) {
  this.id = id;
  this.name = name;
  this.uri = uri;
  this.isVideo = isVideo;
}
}
