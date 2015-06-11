from py2neo import authenticate, Graph, Node, Relationship
from passlib.hash import bcrypt

# authenticate("localhost:7474", "neo4j", "neo4j")
graph = Graph()


class User:
    def __init__(self, usermail):
        self.usermail = usermail

    def set_username(self, username):
        self.username = username
        return self

    def set_password(self, password):
        self.password = bcrypt.encrypt(password)
        return self

    def register(self):
        if not self.find():
            user = Node("User", usermail=self.usermail, username=self.username, password=self.password)
            graph.create(user)
            return True
        else:
            return False

    def find(self):
        user = graph.find_one("User", "usermail", self.usermail)
        return user

    def verify_password(self, password):
        user = self.find()
        if user:
            return bcrypt.verify(password, user['password'])
        else:
            return False

    def add_recipe(self, name, tags, desc, ingr):
        import uuid

        user = self.find()
        recipe = Node(
            "Recipe",
            id=str(uuid.uuid4()),
            name=name,
            desc=desc,
            ingr=[x.strip() for x in ingr.lower().split(',')]
            # timestamp=timestamp()
            # date=date()
        )

        rel = Relationship(user, "PUBLISHED", recipe)
        graph.create(rel)

        tags = [x.strip() for x in tags.lower().split(',')]
        for t in tags:
            tag = graph.merge_one("Tag", "name", t)
            rel = Relationship(tag, "TAGGED", recipe)
            graph.create(rel)

    def like_recipe(self, recipe_id):
        user = self.find()
        recipe = graph.find_one("Recipe", "id", recipe_id)
        graph.create_unique(Relationship(user, "LIKED", recipe))

        query = """
        MATCH (u:User)-[l:LIKED]->(r:Recipe)
        WHERE u.usermail={usermail}
        AND r.id={recipe_id}
        SET l.like=true
        """

        graph.cypher.execute(query, usermail=user['usermail'], recipe_id=recipe_id)

    def dislike_recipe(self, recipe_id):
        user = self.find()
        recipe = graph.find_one("Recipe", "id", recipe_id)
        graph.create_unique(Relationship(user, "LIKED", recipe))

        query = """
        MATCH (u:User)-[l:LIKED]->(r:Recipe)
        WHERE u.usermail={usermail}
        AND r.id={recipe_id}
        SET l.like=false
        """

        graph.cypher.execute(query, usermail=user['usermail'], recipe_id=recipe_id)


def get_recipes():
    query = """
        MATCH (u:User)-[:PUBLISHED]->(r:Recipe),
	          (t:Tag)-[:TAGGED]->(r)
        OPTIONAL MATCH (n)-[:LIKED {like:true}]->(r)
        OPTIONAL MATCH (o)-[:LIKED {like:false}]->(r)
        RETURN r.name AS recipe_name,
               r.desc AS recipe_desc,
               r.ingr AS recipe_ingr,
               r.id AS id,
               u.username AS user_name,
	    COUNT(DISTINCT n) AS likes,
        COUNT(DISTINCT o) AS dislikes,
        COLLECT(DISTINCT t.name) AS tags;
        """

    return graph.cypher.execute(query)