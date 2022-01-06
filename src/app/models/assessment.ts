
import { UtilityService } from '../lib/utility.service';

export class Assessment {

	id: number;
	userQuizId: number; 
	anxiety: number;
	stress: number;
	depression: number;
	anxietylevel: number;
	depressionlevel: number;
	stresslevel: number;
	anxietylevellabel: string;
	depressionlevellabel: string;
	stresslevellabel: string;
	intrusive: number = null;
	avoidance: number = null;
	hyperarousal: number = null;
	ptsd: number = null;
	type: string;
	userId: number;
	score: number; 
	rank1: number; 
	rank2: number; 
	rank3: number; 
	rank4: number; 
	rank5: number; 
	rank6: number; 
	quizType: string;
	created: Date;

	public static initializeArray(objects: any): Assessment[] {

		let results: Assessment[] = [];
		for (let i = 0; i < objects.length; i++) {
			let obj = new Assessment(objects[i]);
			results.push(obj);
		}

		return results;
	}

	constructor(data: any) {
		if (data) {
			this.id = data.ID || data.id;
			this.userQuizId = data.userQuizId || data.UserQuizID; 
			this.type = data.Type || data.type;
			this.anxiety = data.Anxiety || data.anxiety;
			this.depression = data.Depression || data.depression;
			this.stress = data.Stress || data.stress;
			this.anxietylevel = data.AnxietyLevel || data.anxietylevel;
			this.depressionlevel = data.DepressionLevel || data.depressionlevel;
			this.stresslevel = data.StressLevel || data.stresslevel;
			this.anxietylevellabel = data.AnxietyLevelLabel || data.anxietylevellabel;
			this.depressionlevellabel = data.DepressionLevelLabel || data.depressionlevellabel;
			this.stresslevellabel = data.StressLevelLabel || data.stresslevellabel;

			this.intrusive = data.intrusive;
			this.avoidance = data.avoidance;
			this.hyperarousal = data.hyperarousal;
			this.ptsd = data.ptsd;
			this.score = data.Score; 
			this.rank1 = data.Rank1; 
			this.rank2 = data.Rank2; 
			this.rank3 = data.Rank3; 
			this.rank4 = data.Rank4; 
			this.rank5 = data.Rank5; 
			this.rank6 = data.Rank6; 

			this.userId = data.UserID || data.userid;
			this.type = data.Type || data.type;
			this.created = UtilityService.convertToDate(data.Created || data.created);
		}
	}
}
