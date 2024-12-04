from flask import Flask, request, jsonify

app = Flask(__name__)

# Sample in-memory database to store vectors (example format)
vector_db = {}

@app.route('/vectorDB', methods=['GET', 'POST'])
def handle_vector_db():
    if request.method == 'GET':
        # Return all vectors in the database
        return jsonify({"vectors": vector_db}), 200
    
    elif request.method == 'POST':
        # Add a new vector to the database
        new_vector = request.json.get("vector")
        
        if new_vector is None or not isinstance(new_vector, list):
            return jsonify({"error": "Invalid vector data. Please provide a list."}), 400
        
        vector_db.append(new_vector)
        return jsonify({"message": "Vector added successfully!", "vector": new_vector}), 201

if __name__ == '__main__':
    app.run(debug=True)
