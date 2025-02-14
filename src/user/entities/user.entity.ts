import { Model } from 'objection';

export class User extends Model {
  static tableName = 'user';

  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  type: 'Admin' | 'Customer';
  birthdate: string;
  ageToRetirement: number;
  availableNetWorth: number;
  monthlyApplication: number;
  desiredMonthlyIncome: number;
  premissasAposentadoria?: {
    taxaRealEsperadaMensal: any;
    taxaRealEsperadaAnual: any;
  };
  premissasMercado?: {
    inflacaoAnualProjetada: any;
    aliquotaIR: any;
    taxaCdi: any;
    taxaNominalEsperadaMensal: any;
    taxaNominalEsperadaAnual: any;
  };
  premissasRentabilidade?: {
    taxaRealAno: any;
    taxaRealMes: any;
  };
}
