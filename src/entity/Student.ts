import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class Student {
  @PrimaryColumn()
  ra: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cpf: string;
}
