export interface Quiz {
  id: number;
  title: string;
  duration: number;
  questions: Array<any>;
  orderIndex: number;
}
