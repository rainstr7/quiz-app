# React + TypeScript + Vite + Effector + Atomic-router + MUI
![Static Badge](https://img.shields.io/badge/18%2C2-black?style=social&logo=react)
![Static Badge](https://img.shields.io/badge/4%2C1%2C1-black?style=social&logo=vite)
![Static Badge](https://img.shields.io/badge/4%2C9%2C5-black?style=social&logo=typescript)
![Static Badge](https://img.shields.io/badge/effector-23%2C2%2C-black?style=social)
![Static Badge](https://img.shields.io/badge/atomic_router-0%2C1-black?style=social)

Open [Demo](https://quiz-app-six-eta.vercel.app/) to view it in the browser.

Что сделал:  

✅ Вид начального экрана — название теста, ввод имени, кнопка запуска.  

✅ Вид экрана вопроса — текст вопроса, варианты ответов, кнопка «Продолжить». Каждый чекбокс ответа относится к соответствующему вопросу.  

✅ Вид экрана результата — текст «Ваши баллы:», история пройденных тестов (дата и результат), кнопка «Пройти еще раз».  

✅ Вопросы для теста и ответы к ним нужно найти самостоятельно и хранить в локальном файле json. В тесте должны быть как минимум 10 вопросов с 4 вариантами ответов каждый.  


Технические требования:
•	React без использования классовых компонентов;
•	React Hooks;
•	Все действия на сайте должны происходить без перезагрузки страницы;
•	Используйте любой менеджер состояния по вашему выбору (например, Redux, Mobx, Effector). **Использование Effector в задании будет плюсом;**
•	Используйте локальное хранилище (localStorage) для сохранения истории. Сохранённые результаты должны быть доступны после перезагрузки страницы. Плюсом будет, если во время прохождения теста пользователь обновили страницу и остался на том же вопросе;
•	Показывать процент прохождения теста и дополнить цветом, насколько пройден (до 50% красный, 51-75 желтый, 76-100 зеленый);
•	Адаптивность не обязательна, но приветствуется. Приложение должно хорошо выглядеть на десктопе.

✅	Подсветка правильных и не правильных ответов при прохождении теста.  

✅	Случайные позиции для правильного ответа при каждом новом прохождении.  

✅	Экран просмотра подробной истории по выбранному тесту, который выбрали на экране результата (какие варианты ответов выбирал пользователь, сколько было потрачено времени и пр).  

✅	Поддержка до 8ми ответов к вопросу и возможность выбора нескольких правильных ответов.  


В целом все есть. Не продакшн конечно, но в стиль кода, подходы, я думаю что оценить можно, больше чем потратил времени на тестовое уже потратить не могу.
Основные сложности возникли, когда я принял challenge разобраться в `effector`. "Ну подумаешь state manager" - подумал я и потом это "взорвало" мне мозг после многолетнего использования redux и context.
Потом как следствие пришлось разбираться в `atomic-router` потому что адекватно react-router не работает с effector. При практически полном отсутствии experience в интернете и весьма скудной документации было разбираться весело. Ну вот что-то получилось уж не судите строго, но больше времени тратить на тестовое уже не могу.  
Когда немного остыну от взаимодействия с новоизученным стеком вернусь и поправлю баги (но это не точно). )))

запускать по скрипту ```npm run dev```.

Open [http://localhost:5173](http://localhost:5173/) to view it in the browser.


