const fs = require('fs');

export interface Org {
    id: number;
    organization: string;
    products: string[];
    marketValue: string;
    address: string;
    ceo: string;
    country: string;
    noOfEmployees: number;
    employees: string[];
    createdAt: Date;
    updatedAt?: Date | null;

}

type either = Org | undefined


const Organization  = {

    async getOrganizations (): Promise<Array<Org>>  {
        try {
            const buffer: Buffer = await fs.promises.readFile('database.json')
            const data: Array<Org> = JSON.parse(buffer.toString())
            return data
        } catch (er) {
            return []
        }
    },

    async saveToDb (organizations: Array<Org>): Promise<void> {
        const json: string = JSON.stringify(organizations, null, 2)
        await fs.promises.writeFile('database.json', json)
    },

    async findById(id: number) : Promise<Org> {
        const organizations: Array<Org> = await this.getOrganizations()
        const org: either = organizations.find((o) => o.id === id)
        if (!!org) {
            return org
        }
        throw new Error('Not found')
    },

    async getGeneratedId(): Promise<number> {
        const organizations: Array<Org> = await this.getOrganizations()
        const IDs: number[] = organizations.map((user) => user.id )
        let id:number = 1
        if (IDs.length > 0) {
            const maxId: number = Math.max(...IDs)
            id = maxId + 1
        }
        
        return id
    },

    async getAll(): Promise<Array<Org>> {
        const organizations: Array<Org> = await this.getOrganizations()
        return organizations
    },
    
    async getOne(id: number): Promise<Org> {
        const org: either = await this.findById(id)
        return org
    },

    async createOne(data: Org): Promise<Org>{
        const organizations: Array<Org> = await this.getOrganizations()
        const id: number = await this.getGeneratedId()
        const newData: Org = {
            id: id,
            organization: data.organization,
            products: data.products,
            marketValue: data.marketValue,
            address: data.address,
            ceo: data.ceo,
            country: data.country,
            noOfEmployees: data.noOfEmployees,
            employees: data.employees,
            createdAt: new Date(),
            updatedAt: null

        }

        organizations.push({
            ...newData
        })
        this.saveToDb(organizations)
        return newData
    },

    async removeOne (id: number): Promise<{status: string}>  {
        const orgs: Array<Org> = await this.getOrganizations()
        const newId = await this.findById(id)
        const newOrg: Array<Org> = orgs.filter((org) => org.id !== id)
        this.saveToDb(newOrg)
        return {status: 'ok'}
    },

    async updateOne (id: number, data: Org): Promise<Org> {
        const org: either = await this.findById(id)
        const newData: Org = {
            ...org,
            ...data,
            updatedAt: new Date()
        }
        let organizations: Array<Org>  = await this.getOrganizations()
        const index: number = organizations.findIndex((d) => d.id === id)
        organizations.splice(index, 1, newData)
        this.saveToDb(organizations)
        return newData
        
    }

}

export default Organization







