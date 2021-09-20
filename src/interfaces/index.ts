export type setState = {
  boolean: React.Dispatch<React.SetStateAction<boolean>>;
  string: React.Dispatch<React.SetStateAction<string>>;
  number: React.Dispatch<React.SetStateAction<number>>;
};

export type IOnChange = React.ChangeEvent<HTMLInputElement>;

export type children = React.ReactNode;
