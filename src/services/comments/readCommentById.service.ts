import { AppDataSource } from "../../data-source";
import { Comment } from "../../entities/comments.entity";
import { EntityNotFoundError, Repository } from "typeorm";
import { tCommentResponse } from "../../interfaces/comments.interfaces";
import { AppError } from "../../errors";

const readCommentByIdService = async (
  id: number
): Promise<tCommentResponse> => {
  const commentRepository: Repository<Comment> =
    AppDataSource.getRepository(Comment);

  const findComment: Comment | null = await commentRepository.findOne({
    where: { id: id },
    relations: { user: true, advert: true },
  });

  if (!findComment) {
    throw new AppError("Comentário não encontrado", 404);
  }

  const comment: Comment | null = await commentRepository
    .createQueryBuilder("comments")
    .select(["comments", "users.id", "users.name", "users.email", "adverts.id"])
    .innerJoin("comments.user", "users")
    .innerJoin("comments.advert", "adverts")
    .where("comments.id = :id", { id: id })
    .getOne();

  if (!comment) {
    throw new AppError("Comentário não encontrado", 404);
  }

  return comment;
};

export default readCommentByIdService;
