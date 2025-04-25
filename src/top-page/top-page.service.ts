import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopPageModel, TopLevelCategory } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel.name)
    private readonly topPageModel: Model<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async findAll() {
    return this.topPageModel.find({}).exec();
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this.topPageModel
      .aggregate([
        { $match: { firstLevelCategory: firstCategory } },
        {
          $group: {
            _id: '$secondLevelCategory',
            pages: { $push: { alias: '$alias', title: '$title' } },
          },
        },
      ])
      .exec();
  }

  async findByText(text: string) {
    return this.topPageModel
      .find({ $text: { $search: text, $caseSensitive: false } })
      .exec();
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
