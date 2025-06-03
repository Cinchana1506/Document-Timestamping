from flask import Flask, render_template, request

app = Flask(__name__)
feedback_list = []

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        name = request.form["name"]
        feedback = request.form["feedback"]
        feedback_list.append((name, feedback))
        return "Thank you for your feedback!"
    return render_template("form.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
