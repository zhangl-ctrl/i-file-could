type FileChildren = Record<string, string>;

export type fileType = {
  name?: string;
  isFolder?: boolean;
  children?: FileChildren[];
};

export type bucketTokens = {
  bucket: string;
  token: string;
  expires: number;
  ctime: string | number;
};
