export type UseState<T, Prefix extends string> = {
  [k in `set${Capitalize<Prefix>}`]: React.Dispatch<React.SetStateAction<T>>;
} & {
  [k in Prefix]: T;
};
