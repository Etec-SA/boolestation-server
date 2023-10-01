import { PartialType } from "@nestjs/swagger";
import { CreateLevelStateDto } from "./create-level-state.dto";

export class UpdateLevelStateDto extends PartialType(CreateLevelStateDto) {}
