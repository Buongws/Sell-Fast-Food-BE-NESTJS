import {
  BooleanNotRequired,
  NumberNotRequired,
  StringNotRequired,
  StringRequired,
} from '../../../common/decorators';

export class CreateCategoryDto {
  @StringRequired('name')
  name: string;

  @StringNotRequired
  description?: string;

  @NumberNotRequired
  sortOrder?: number;

  @BooleanNotRequired
  isActive?: boolean;
}
