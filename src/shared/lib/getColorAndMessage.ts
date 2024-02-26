type ColorAndMessageType = [
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    message: string
]

export const getColorAndMessage = (attitude: number): ColorAndMessageType => {
    if (attitude < 0.5) {
        return ['error', 'Bad try :(']
    } else if (attitude < 0.75) {
        return ['warning', 'Good try']
    } else {
        return ['success', 'My congratulations to you!'];
    }
}

