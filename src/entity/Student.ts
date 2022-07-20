import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  ra: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cpf: string;
}
