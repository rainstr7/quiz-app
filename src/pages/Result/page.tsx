import {useUnit} from "effector-react";
import {$quizHistory} from "../../entities/quiz";

const ResultPage = () => {
    const quizHistory = useUnit($quizHistory);

    return <div>
        {quizHistory
            .map((itemHistory) => `${itemHistory.score}: ${itemHistory.lengthQuiz}`)
        }
    </div>
}

export default ResultPage;
