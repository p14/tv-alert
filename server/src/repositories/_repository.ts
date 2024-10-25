import { injectable, unmanaged } from 'inversify';
import {
    AnyKeys,
    CallbackWithoutResult,
    Document,
    FilterQuery,
    Model,
    PipelineStage,
    ProjectionType,
    QueryOptions,
    Schema,
    Types,
    UpdateQuery,
    UpdateWithAggregationPipeline,
    _LeanDocument,
    model,
} from 'mongoose';

@injectable()
export default class Repository<TModel extends Document> {
    private name: string;

    private schema: Schema;

    protected Model: Model<TModel>;

    public constructor(
        @unmanaged() name: string,
        @unmanaged() schema: Schema,
    ) {
        this.name = name;
        this.schema = schema;

        schema.set('toObject', { versionKey: false, virtuals: true });
        schema.set('toJSON', { versionKey: false, virtuals: true });

        this.Model = model<TModel>(this.name, this.schema);
    }

    public getName(): string {
        return this.name;
    }

    public getModel(): Model<TModel> {
        return this.Model;
    }

    public async save(
        document: any,
    ) {
        return new this.Model(document).save();
    }

    public async create(
        document: TModel | AnyKeys<TModel>
    ) {
        return this.Model.create(document);
    }

    public async find(
        query: FilterQuery<TModel>,
        projection?: ProjectionType<TModel>,
    ) {
        return this.Model.find(query, projection);
    }

    public async findOne(
        query: FilterQuery<TModel>,
    ) {
        return this.Model.findOne(query);
    }

    public async findOneAndUpdate(
        query: FilterQuery<TModel>,
        document: UpdateWithAggregationPipeline | UpdateQuery<TModel>,
    ) {
        return this.Model.findOneAndUpdate(query, document, { new: true, runValidators: true, returnDocument: 'after' });
    }

    public async updateOne(
        query: FilterQuery<TModel>,
        document: UpdateWithAggregationPipeline | UpdateQuery<TModel>,
        options: QueryOptions<TModel> | undefined = {}
    ) {
        return this.Model.updateOne(query, document, options);
    }

    public async updateMany(
        query: FilterQuery<TModel>,
        document: UpdateWithAggregationPipeline | UpdateQuery<TModel>,
    ) {
        return this.Model.updateMany(query, document);
    }

    public async updateByQuery(
        query: FilterQuery<TModel>,
        document: UpdateWithAggregationPipeline | UpdateQuery<TModel>,
    ) {
        return this.Model.updateOne(query, document);
    }

    public async deleteOne(
        id: Types.ObjectId,
        callback?: CallbackWithoutResult,
    ) {
        return this.Model.deleteOne({ _id: id } as FilterQuery<TModel>, callback);
    }

    public async aggregate(
        query: PipelineStage[],
    ) {
        return this.Model.aggregate(query);
    }
}
