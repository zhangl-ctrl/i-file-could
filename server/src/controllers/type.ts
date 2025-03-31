type FileChildren = Record<string, string>;

export type fileType = {
  name?: string;
  isFolder?: boolean;
  children?: FileChildren[];
};
